<?php

namespace App\Http\Controllers;

use App\Models\Deals\Deal;
use App\Models\Remont\Act;
use App\Models\Remont\Room;
use App\Models\Remont\Smet;
use App\Models\Works\Work;
use App\Models\Works\WorkCategory;
use App\Models\Works\WorkGroup;
use Illuminate\Support\Facades\Storage;
use PDF;

//use Barryvdh\DomPDF\Facade\Pdf;

class PdfController extends Controller
{
    public function smet(Deal $deal, Smet $smet)
    {
        $filename = md5(serialize($deal->price).$smet->updated_at);
        $pathToFile = 'deals/'.$deal->id.'/pdf/'.$filename;
        if (!Storage::exists($pathToFile)) {
            $config = [
                'h2toc' => [
                    'H1' => 0,
                ],
            ];

            $pdf = Pdf::loadView('Pdf.smet', data: [
                'smet' => [
                    'n' => $smet->id,
                    'date' => $smet->created_at->format('d.m.Y'),
                ],
                'deal' => [
                    'uid' => $deal->uid,
                    'date' => $deal->created_at->format('d.m.Y'),
                    'address' => $deal->address,
                ],
                'roomsList' => Room::where('deal_id', $smet->deal_id)->get()->keyBy('id'),
                'price' => $this->getDealPrices($deal),
                'rooms' => $smet->rooms['works'],
            ],config: $config);

            Storage::put($pathToFile, $pdf->output());
        }
        $headers = ['Content-Type' => 'application/pdf', 'Content-disposition' => 'inline; filename="smet.pdf"'];
        return response()->file(Storage::path($pathToFile), $headers);
    }

    private function getDealPrices(Deal $deal): array
    {
        $priceList = [];
        $works = Work::with('group.category')->orderBy('work_group_id')->get()->keyBy('id');
        $eds = config('atlon.list.work.eds');
        foreach ($deal->price['list'] as $item => $value) {
            $work = $works->get($item);
            $priceList[$item] = [
                'name' => $work->name,
                'ed' => $eds[$work->ed],
                'price' => $value,
                'group' => ['id' => $work->group->id, 'name' => $work->group->name],
                'category' => ['id' => $work->group->category->id, 'name' => $work->group->category->name],
            ];
        }
        if (isset($deal->price['additional'])) {
            foreach ($deal->price['additional'] as $index => $item) {
                $priceList[$index] = [
                    'name' => $item['name'],
                    'ed' => $eds[$item['ed']],
                    'price' => $item['price'],
                    'group' => [
                        'id' => $item['work_group_id'],
                        'name' => WorkGroup::find($item['work_group_id'])->name,
                    ],
                    'category' => ['id' => $item['category'], 'name' => WorkCategory::find($item['category'])->name],
                ];
            }
            uasort($priceList, function ($a, $b) {
                if ($a['group']['id'] == $b['group']['id']) {
                    return 0;
                }
                return ($a['group']['id'] < $b['group']['id']) ? -1 : 1;
            });
        }


        return $priceList;
    }

    public function act(Deal $deal, Act $act)
    {
        $filename = md5(serialize($deal->price).$act->updated_at);

        $pathToFile = 'deals/'.$deal->id.'/pdf/'.$filename;
        if (!Storage::exists($pathToFile)) {
            $pdf = Pdf::loadView('Pdf.act', [
                'act' => [
                    'n' => $act->id,
                    'date' => $act->created_at->format('d.m.Y'),
                ],
                'deal' => [
                    'uid' => $deal->uid,
                    'date' => $deal->created_at->format('d.m.Y'),
                    'address' => $deal->address,
                ],
                'rooms' => Room::select(['id', 'name'])->where('deal_id', $act->deal_id)->get()->keyBy('id'),
                'price' => $this->getDealPrices($deal),
                'works' => $act->works,
            ]);

            Storage::put($pathToFile, $pdf->output());
        }

        $headers = ['Content-Type' => 'application/pdf', 'Content-disposition' => 'inline; filename="act.pdf"'];
        return response()->file(Storage::path($pathToFile), $headers);
    }

    public function price(Deal $deal)
    {
        $filename = md5(serialize($deal->price));

        $pathToFile = 'deals/'.$deal->id.'/pdf/'.$filename;
        if (!Storage::exists($pathToFile)) {
            $pdf = Pdf::loadView('Pdf.price', [
                'deal'=>[
                    'uid' => $deal->uid,
                    'date' => $deal->created_at->format('d.m.Y'),
                ],
                'price' => $this->getDealPrices($deal),
            ]);
            Storage::put($pathToFile, $pdf->output());
        }
        $headers = ['Content-Type' => 'application/pdf', 'Content-disposition' => 'inline; filename="price.pdf"'];
        return response()->file(Storage::path($pathToFile), $headers);
    }
}
