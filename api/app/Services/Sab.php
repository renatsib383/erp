<?php

namespace App\Services;

use App\Models\Contacts\Contact;
use App\Models\Deals\Deal;
use App\Models\Deals\Pipeline;
use App\Models\Deals\Stage;
use App\Models\Deals\Task;
use App\Models\Remont\Act;
use App\Models\Remont\Room;
use App\Models\Remont\Smet;
use App\Models\Role;
use App\Models\Staff\Employee;
use App\Models\User;
use App\Models\Works\Work;
use App\Models\Works\WorkCategory;
use App\Models\Works\WorkCollection;
use App\Models\Works\WorkGroup;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class Sab
{
    private array $roomsTypes = [ ///key:sab - id, value: our index
        '3' => 0, //"Комната"
        '6' => 7, //"Кухня"
        '7' => 9, //"Санузел"
        '9' => 4, //"Балкон"
        '13' => 1, //"Спецмонтаж"
        '14' => 5, //"Двери"
        '15' => 3, //"Сантехника"
        '16' => 2, //"Электрика"
        '17' => 10, //"Студия"
        '24' => 8, //"Отопление"
        '26' => 6, //"Демонтаж"
    ];

    private array $roomShapes = [
        '1' => 'rectangle',
        '2' => 'l_shape',
        '3' => 'trapezoid',
        '4' => 'custom',
    ];

    private array $roomColonTypes = [
        '1' => [  /// "Внешний угол"
            'type' => 0,
            'projectionsCorner' => 1,
            'projectionsCornerInner' => 1,
        ],
        '2' => [  /// "Выступ"
            'type' => 1,
            'projectionsCorner' => 2,
            'projectionsCornerInner' => 2,
        ],
        '3' => [ /// "Колонна"
            'type' => 2,
            'projectionsCorner' => 4,
            'projectionsCornerInner' => 0,
        ],
    ];

    private array $price;

    private array $approvedRooms;

    private array $eds;

    private Collection $works;

    public function __construct()
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', '512M');
        $this->works = Work::All('id', 'sab_id')->pluck('id', 'sab_id');

        $this->eds = config('atlon.list.work.eds');
    }

    public function getData(Deal $deal): Deal|string
    {
        $userId = Auth::id();
        Auth::loginUsingId(768);

        if (is_null($deal->sab_id)) {
            $dealsList = $this->request([
                'form' => 'data',
                'type' => 'api_crm_lead',
                'method' => 'getListDeal',
            ], [
                'filter' => '{"filter":{"search":"","filter_search":{"number_contract":{"void":false,"search":"'.$deal->uid.'"}}}}',
            ]);

            if ($dealsList === null) {
                $this->auth();
            }

            if (count($dealsList) > 0) {
                $subDealId = $dealsList[0]['id'];
                $deal->sab_id = $subDealId;
                $deal->saveQuietly();
            } else {
                return $deal->uid.' not found in Sab';
            }
        }

        $this->dealData($deal);

        $this->price = $this->getPrice($deal->sab_id); /// Получаем обязательно до работы со сметами и актами

        $this->getSabSmets($deal);
        $this->getSabActs($deal);

        $this->price['additional'] = $this->makeAdditionalPrice($deal->id);

        $deal->price = $this->price;
        $deal->save();

        Auth::loginUsingId($userId);

        return $deal->load(['tags']);
        //return $deal->load(['rooms', 'smets', 'acts', 'tags']);
    }

    public function getPipelines(): void
    {
        $pipelinesSab = $this->request([
            'form' => 'data',
            'type' => 'api_crm_stage_status',
            'method' => 'getListStageStatus',
        ], [
            'modules_id' => 2,
        ]);
        foreach ($pipelinesSab as $pipelineSab) {
            $data = [
                'name' => $pipelineSab['name'],
                'sab_id' => $pipelineSab['id'],
                'archive' => false,
            ];
            $dealPipeline = Pipeline::firstOrCreate($data);
            foreach ($pipelineSab['status'] as $stageSab) {
                $data = [
                    'pipeline_id' => $dealPipeline->id,
                    'title' => $stageSab['name'],
                    'color' => $stageSab['background'],
                    'sab_id' => $stageSab['id'],
                ];
                Stage::firstOrCreate($data);
            }
        }
    }

    private function dealData(Deal $deal): void
    {
        $dealSab = $this->request([
            'form' => 'data',
            'type' => 'api_crm_lead',
            'method' => 'getDeal',
        ], [
            'id' => $deal->sab_id,
        ]);

        $stagesIds = Stage::select(['id'])->whereNotNull('sab_id')->get()->pluck('id')->toArray();

        $stage = Stage::where('sab_id', $dealSab['idContStat'])->firstOrFail()->id;

        $dealStages = $deal->stages()->get();
        $detachIds = [];
        foreach ($dealStages as $dealStage) {
            if (in_array($dealStage->id, $stagesIds)) {
                $detachIds[] = $dealStage->id;
            }
        }
        $deal->stages()->detach($detachIds);
        $deal->stages()->attach([$stage]);

        $deal_contacts = $deal->contacts()->get();

        foreach ($dealSab['clients'] as $contact) {
            $name = $contact['name'];
            $phone = preg_replace('/[^0-9]/', '', $contact['phone_valid']);
            $dbc = Contact::firstOrCreate(['phone' => $phone], ['name' => $name]);
            if (! $deal_contacts->contains($dbc)) {
                $deal->contacts()->attach($dbc);
            }
        }

        $company = collect(config('atlon.list.company'))->pluck('id', 'sab_id');

        $data = [
            'company_id' => $company->get($dealSab['company']['id']),
            'address' => $dealSab['address'],
            'tags' => collect($dealSab['tags'])->pluck('name')->toArray(),
        ];

        if ($dealSab['measurement']) {
            $this->createTask($dealSab['measurement'][0], $deal);
        }

        if (isset($dealSab['value_info'][6])) {
            $data['region'] = $dealSab['value_info'][6];
        }
        if (isset($dealSab['value_info'][1])) {
            $prorab = User::select('id')->where('name', $dealSab['value_info'][1])->first();
            if ($prorab) {
                $data['prorab'] = $prorab->id;
            }
        }
        if (isset($dealSab['value_info'][10])) {
            $data['partner'] = $dealSab['value_info'][10];
        }
        if (isset($dealSab['value_info'][8])) {
            $data['coef'] = $dealSab['value_info'][8];
        }

        $deal->updateQuietly($data);
    }

    private function getSabSmets($deal): void
    {
        $smets = $this->request([
            'form' => 'data',
            'type' => 'update_contract_item',
            'method' => 'getCalculation',
        ], [
            'id' => $deal->sab_id,
        ]);

        foreach ($smets['history'] as $smet) {
            $smet['approved'] = $smets['calc'] === $smet['calc'];
            $smetRooms = $this->importSmet($smet, $deal->id);
            if (! is_null($smetRooms)) {
                $this->approvedRooms = $smetRooms;
            }
        }
    }

    private function getSabActs($deal): void
    {
        $acts = $this->request([
            'form' => 'data',
            'type' => 'update_contract_item',
            'method' => 'getAct',
        ], [
            'id' => $deal->sab_id,
        ]);
        //dd($acts);
        foreach ($acts as $act) {
            if (! $act['deleted']) {
                $this->importAct($deal->id, $act);
            }
        }
    }

    public function getSabContacts($position = 0)
    {
        return $this->request([
            'form' => 'data',
            'type' => 'api_crm_contact',
            'method' => 'getListContact',
        ], [
            'filter' => '{"position":'.$position.',"form":"contact","idCompany":"39"}',
        ]);
    }

    public function getSabUsers(): void
    {
        $this->usersGeneration();
        $this->setChefs();
    }
    private function setChefs():void
    {
        $msk =  $this->request([
            'form' => 'api',
            'type' => 'update_division',
            'method' => 'getDivision',
        ], [
            'idCompany' => 39,
        ]);
        foreach ($msk as $item){
            $this->setChef($item);
        }
        $spb =  $this->request([
            'form' => 'api',
            'type' => 'update_division',
            'method' => 'getDivision',
        ], [
            'idCompany' => 43,
        ]);
        foreach ($spb as $item){
            $this->setChef($item);
        }
    }
    private function setChef($item):void
    {
        $techDirs = [
            'МСП' => 307,
            'ЧЮД' => 308,
            'ЗИВ Север' => 604
        ];
        $data =  $this->request([
            'form' => 'api',
            'type' => 'update_division',
            'method' => 'getStructureDivision',
        ], [
            'id' => $item['id'],
        ]);
        if(empty($data['sf'])){
            $nuSabId = $techDirs[$item['name']];
        }else{
            $nu = array_pop($data['sf']);
            $nuSabId = $nu['id'];
        }
        $chief = Employee::where('sab_id',$nuSabId)->first()->id;
        foreach ($data['brigadier'] as $prorab){
            $employee = Employee::where('sab_id',$prorab['id'])->first();
            if($employee){
                $employee->chief = $chief;
                $employee->save();
            }
        }
    }
    private function usersGeneration(): void
    {
        $usersMarketMSK = DB::connection('market')->table('msk_users')->select(['email','username','keep'])->get();
        $usersMarketSPB = DB::connection('market')->table('spb_users')->select(['email','username','keep'])->get();

        $mskPasswords = $usersMarketMSK->pluck('keep','email');
        $spbPasswords = $usersMarketSPB->pluck('keep','email');

        $mskShorts = $usersMarketMSK->pluck('email','username');
        $spbShorts = $usersMarketSPB->pluck('email','username');

        $msk = $this->request([
            'form' => 'api',
            'type' => 'api_staff_staff',
            'method' => 'getListStaff',
        ], [
            'filter' => '{"position":0,"limit":500,"idCompany":"39","filter":{"search":"","filter":{"role":{"not":false,"element":["27","8","3"]}}}}',
        ]);
        foreach ($msk as $user){
            $this->makeUser($user,$mskShorts,$mskPasswords);
        }

        $spb =  $this->request([
            'form' => 'api',
            'type' => 'api_staff_staff',
            'method' => 'getListStaff',
        ], [
            'filter' => '{"position":0,"limit":500,"idCompany":"43","filter":{"search":"","filter":{"role":{"not":false,"element":["8","3"]}}}}',
        ]);

        foreach ($spb as $user){
            $this->makeUser($user,$spbShorts,$spbPasswords);
        }
    }

    private function makeUser($user,$names,$passwords): void
    {
        switch ($user['role_id']){
            case 3: /// Прораб
                $positionId = 3;
                $roleId = 3;
                break;
            case 8: // НУ
                $positionId = 2;
                $roleId = 2;
                break;
            case 27:
                $positionId = 4;
                $roleId = 4;
                break;
            default:
                $positionId = 0;
                $roleId = 0;
                break;
        }
        if($user['email'] === ''){
            $email = $names->get($user['name_short'],null);
        }else{
            $email = $user['email'];
        }
        if(is_null($email)){
            return;
        }

        if($positionId &&  !$user['blocked'] && !User::where('email',$email)->first()){
            $employee = Employee::createQuietly([
                'short_name' => $user['name_short'] !== '' ? $user['name_short'] : null,
                'birthday' => $user['date_birthday'] !== '' ? $user['date_birthday'] : null,
                'fio' => $user['name'] !== '' ? $user['name'] : null,
                'email' => $email,
                'phone' => $user['phone_valid'] !== '' ? $user['phone_valid'] : null,
                'work_phone' => $user['phone_work_valid'] !== '' ? $user['phone_work_valid'] : null,
                'position_id' => $positionId,
                'sab_id' => $user['id_user'],
            ]);

            $password = $passwords->get($email,'12345678');

            $userDB = new User;
            $userDB->name = $user['name_short'];
            $userDB->email = $email;
            $userDB->email_verified_at = now();
            $userDB->password = Hash::make($password);
            $userDB->remember_token = Str::random(10);
            $userDB->profile()->associate($employee);
            $userDB->saveQuietly();
            $userDB->roles()->attach($roleId);
            $userDB->saveQuietly();
        }
    }
    public function getSabUser($id)
    {
        return $this->request([
            'form' => 'data',
            'type' => 'api_staff_staff',
            'method' => 'get',
        ], [
            'id' => $id,
        ]);
    }

    private function makeAdditionalPrice($subDealId): array
    {
        $worksSab = $this->request([
            'form' => 'data',
            'type' => 'update_contract_item',
            'method' => 'getObjectWorkContract',
        ], [
            'idContract' => $subDealId,
        ]);
        $worksSab = collect($worksSab)->pluck('name', 'id');
        $additional = [];
        foreach ($this->price['additional'] as $key => $work) {
            if ($work['used']) {
                $workObject = explode(' ➜ ', $worksSab->get($work['idWorkObject']));
                $cat = WorkCategory::firstOrNew(['name' => $workObject[0]], ['id' => 9]);
                $group = WorkGroup::firstOrNew(['name' => $workObject[1]], ['id' => 5]);
                $adw = [
                    'id' => $key,
                    'sab_id' => $key,
                    'name' => $work['name'],
                    'price' => $work['priceMain'],
                    'default_value' => $work['default_value'],
                    'category' => $cat->id,
                    'work_group_id' => $group->id,
                    'factor' => (int) $work['relationType'],
                    'ed' => $this->searchEdByName($work['relationTypeName']),
                ];
                $additional[$key] = $adw;
            }
        }

        return $additional;
    }

    private function getPrice($subDealId): array
    {
        $price = [];
        $priceAdditional = [];

        $prices = $this->request([
            'form' => 'data',
            'type' => 'update_contract_item',
            'method' => 'getFullVerWorkContract',
        ], [
            'id' => $subDealId,
        ]);

        $subDealPrice = $prices['ver_work'][$prices['deal']];

        foreach ($subDealPrice as $item) {
            $workId = $this->works->get($item['idWork']);
            if (! is_null($workId)) {
                $price[$workId] = $item['priceMain'];
            } else {
                $item['used'] = false;
                $priceAdditional[$item['idWork']] = $item;
            }
        }

        return [
            'created_at' => Carbon::now(),
            'list' => $price,
            'additional' => $priceAdditional,
            'sab_ver' => $prices['deal'],
        ];
    }

    private function importSmet($subSmet, $deal_id): ?array
    {
        $savedSmet = Smet::firstOrCreate([
            'deal_id' => $deal_id,
            'sab_ver' => $subSmet['idContractCalcVer'],
        ], [
            'name' => $subSmet['name'].' из SAB',
        ]);

        $smet = [
            'create_at' => $subSmet['create_at'],
            'approved' => $subSmet['approved'],
            'total' => $subSmet['priceDiscount'] > 0 ? $subSmet['priceDiscount'] : $subSmet['price'],
            'rooms' => ['all' => true, 'list' => [], 'works' => []],
        ];
        $rooms = [];

        foreach ($subSmet['calc'] as $sabRoom) {

            $room = Room::firstOrCreate([
                'deal_id' => $deal_id,
                'sab_id' => $sabRoom['idContractEstimationRoom'],
            ]);

            $sDoor = $sabRoom['roomParam']['sDoor'] ?? 0;
            $sWindow = $sabRoom['roomParam']['sWindow'] ?? 0;
            $data = [
                'type' => 1, /// Устанавливаем общестрой для импортированных
                'name' => $sabRoom['name'].' из SAB',
                'perimeter' => $sabRoom['roomParam']['pceiling'] ?? 0,
                'p_floor' => $sabRoom['roomParam']['pfloor'] ?? 0,
                's_floor' => $sabRoom['roomParam']['sfloor'] ?? 0,
                's_walls' => $sabRoom['roomParam']['swall'] ?? 0,
                'height' => $sabRoom['roomParam']['hwall'] ?? 0,
                'doors_width' => $sabRoom['roomParam']['lengthDoorThreshold'] ?? 0,
                's_holes' => $sDoor + $sWindow,
                'slopes_doors' => $sabRoom['roomParam']['scarpDoor'] ?? 0,
                'slopes_windows' => $sabRoom['roomParam']['scarpWindow'] ?? 0,
                'doors' => [],
                'windows' => [],
                'columns' => [],
                'room_size' => [
                    'shape' => $this->roomShapes[$sabRoom['typeRoom']],
                    'a' => $sabRoom['roomSize']['a'] ?? null,
                    'b' => $sabRoom['roomSize']['b'] ?? null,
                    'c' => $sabRoom['roomSize']['c'] ?? null,
                    'd' => $sabRoom['roomSize']['d'] ?? null,
                    'h' => $sabRoom['roomSize']['h'] ?? null,
                    'p' => $sabRoom['roomParam']['pfloor'] ?? null,
                    's' => $sabRoom['roomParam']['sfloor'] ?? null,
                    's_walls' => $sabRoom['roomParam']['swall'] ?? null,
                    's_columns' => 0,
                    'p_columns' => 0,
                    'outer_corner' => $sabRoom['roomParam']['outer-corner'] ?? 0,
                    'inner_corner' => $sabRoom['roomParam']['inner-corner'] ?? 0,
                    'projectionsCorner' => 0, // углы колон внешние
                    'projectionsCornerInner' => 0, // углы колон внутренние
                ],
            ];

            foreach ($sabRoom['colon'] as $colon) {
                $col = $this->roomColonTypes[$colon['type']];
                $data['columns'][] = [
                    'type' => $col['type'],
                    'a' => $colon['length'],
                    'b' => $colon['weight'],
                ];
                $s_columns = $colon['length'] * $colon['weight'];
                $p_columns = match ($col['type']) {
                    0 => $colon['weight'] + $colon['length'],
                    1 => $colon['weight'] * 2 + $colon['length'],
                    2 => ($colon['weight'] + $colon['length']) * 2,
                };
                $data['room_size']['s_columns'] += $s_columns;
                $data['room_size']['p_columns'] += $p_columns;
                $data['room_size']['projectionsCorner'] += $col['projectionsCorner'];
                $data['room_size']['projectionsCornerInner'] += $col['projectionsCornerInner'];
            }
            foreach ($sabRoom['opening'] as $open) {
                $item = [
                    'value' => 1,
                    'height' => $open['a'],
                    'width' => $open['b'],
                ];
                if ($open['idOpening'] === 5) { // Дверь
                    $data['doors'][] = $item;
                }
                if ($open['idOpening'] === 6) { // Окно
                    $item['depth'] = $open['depth'];
                    $data['windows'][] = $item;
                }
            }
            $room->update($data);

            $works = [
                'total' => $sabRoom['roomParam']['stock-price'],
                'works' => [],
            ];
            foreach ($sabRoom['work'] as $sabWork) {
                $works['works'][$this->getWorkId($sabWork['id'])] = $sabWork['col'];
            }
            $smet['rooms']['all'] = true;
            $smet['rooms']['list'][] = $room->id;
            $smet['rooms']['works'][$room->id] = $works;

            //$data['works'] = $smet['rooms']['works'];
            $rooms[$room->id] = $smet['rooms']['works'];
        }
        $savedSmet->update($smet);

        return $subSmet['approved'] ? $rooms : null;
    }

    private function importAct($deal_id, $subAct): array
    {

        $act = Act::firstOrCreate([
            'deal_id' => $deal_id,
            'sab_id' => $subAct['idContAct'],
        ], [
            'user_id' => Auth::id(),
        ]);

        $data = [
            'status' => $subAct['accept_demo'] ? 2 : 0,
            'total' => $subAct['price'],
            'works' => [],
        ];
        $works = [];
        foreach ($subAct['dataAct'] as $subActWork) {
            $works[$this->getWorkId($subActWork['id'])] = $subActWork['col'];
        }

        $data['works'][] = ['total' => 0, 'works' => $works];

        $act->update($data);

        return $data;
    }

    private function getWorkId($id)
    {
        $workId = $this->works->get($id);
        if (is_null($workId)) {
            $this->price['additional'][$id]['used'] = true;
            $workId = $id;
        }

        return $workId;
    }

    private function auth()
    {
        $this->request([], ['login' => 'kiselev', 'password' => 'Test987!']);
    }

    private function request(array $query, array $data): mixed
    {
        $response = Http::withQueryParameters($query)->withCookies([
            'SCID' => 'd5e9c4700e229a00f4c13464802a6790', // Long Live
            'STID' => '85f360e1ca3b9c1f8ee0e7f03754edaf', // Session
        ], 'atlonfm.sab-space.ru')
            ->asForm()
            //->dd()
            ->post('https://atlonfm.sab-space.ru', $data);

        return json_decode($response->body(), true);
    }

    private function searchEdByName(string $ed_name): int
    {
        if ($ed_name === 'м') {
            $ed_name = 'пог.м.';
        }
        if ($ed_name === 'м<sup>2</sup>') {
            $ed_name = 'кв.м.';
        }
        if ($ed_name === 'шт.') {
            $ed_name = 'шт';
        }
        foreach ($this->eds as $key => $val) {
            if ($val === $ed_name) {
                return $key;
            }
        }

        return 0;
    }

    private function createTask(mixed $measuring, Deal $deal): void
    {
        $data = [
            'deal_id' => $deal->id,
            'status' => 1,
            'type' => 2,
            'title' => $measuring['namePeriod'],
            'start' => Carbon::createFromFormat('Y-m-d H:i:s', $measuring['measurement_date'].' '.$measuring['measurement_time']),
            'allDay' => 0,
            'author' => Auth::id(),
        ];
        Task::firstOrCreate($data);
    }

    public function getWorks(): void
    {
        $roomTypes = [
            35 => [0],
            36 => [0],
            34 => [0],
            33 => [0],
            39 => [3],
            44 => [1],
            47 => [1],
            40 => [0],
            46 => [3],
            45 => [1],
            42 => [1],
            43 => [1],
            38 => [2],
        ];

        $sabRelations = $this->request([
            'form' => 'api',
            'type' => 'api_work_work',
            'method' => 'getRelationType',
        ], []);

        $sabObj = $this->request([
            'form' => 'api',
            'type' => 'api_work_work',
            'method' => 'getStructureWork',
        ], [
            'idCompany' => 39,
        ]);
        foreach ($sabObj as $sabCategory) {
            $data = [
                'name' => $sabCategory['name'],
            ];

            if(isset($roomTypes[$sabCategory['id']])){
                $data['room_types'] = $roomTypes[$sabCategory['id']];
            }

            $category = WorkCategory::updateOrCreate(['sab_id' => $sabCategory['id']],$data);

            foreach ($sabCategory['object_work'] as $sabGroup) {
                $group = WorkGroup::updateOrCreate(
                    ['sab_id' => $sabGroup['id']],
                    [
                        'work_category_id' => $category->id,
                        'name' => $sabGroup['name'],
                        //'sort' => $sabGroup['sort'],
                    ],
                );
                foreach ($sabGroup['work'] as $sabWork) {
                    Work::updateOrCreate(
                        ['sab_id' => $sabWork['idWork']],
                        [
                            'work_group_id' => $group->id,
                            'name' => $sabWork['name'],
                            'sort' => $sabWork['sort'],
                            'price' => $sabWork['defaultPrice'],
                            'default_value' => (float) $sabWork['default_value'],
                            'factor' => $sabWork['relationType'],
                            'ed' => $this->searchEdByName($sabRelations[$sabWork['relationType']]['unit']),
                        ],
                    );
                }
            }
        }
    }

    public function getWorkCollections(): void
    {
        set_time_limit(300);
        $sabRooms = $this->request([
            'form' => 'api',
            'type' => 'api_work_work_group',
            'method' => 'getCatalogWorkGroup',
        ], [
            'idCompany' => 39,
            'is_all' => 1,
        ]);

        foreach ($sabRooms as $sabRoom) {
            foreach ($sabRoom['work_group'] as $sabCollection) {
                $sabCollectionWorks = $this->request([
                    'form' => 'api',
                    'type' => 'api_work_work_group',
                    'method' => 'get',
                ], [
                    'id' => $sabCollection['id'],
                ]);
                $works = [];
                foreach ($sabCollectionWorks['works'] as $work) {
                    $works[$this->getWorkId($work['work_id'])] = $work['multiplier'];
                }
                WorkCollection::updateOrCreate([
                    'sab_id' => $sabCollection['id'],
                ], [
                    'name' => $sabCollection['name'],
                    'room_type' => $this->roomsTypes[$sabRoom['id']],
                    'works' => $works,
                ]);
            }
        }
    }
}
