<?php

namespace App\Http\Controllers;

use App\Data\UserData;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Staff\Employee;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $fields = ['id','name', 'email','profile_type','profile_id','roles.id','roles.name'];
        $filters = [
            AllowedFilter::callback('roles', function (Builder $query, $value) {
                $query->whereHas('roles',function (Builder $query) use ($value) {
                    $query->whereIn('role_id', Arr::wrap($value));
                });
            }),
            ...$fields,
        ];
        return QueryBuilder::for(User::class)
            ->allowedFields($fields)
            ->allowedIncludes(['events.user','roles','employee'])
            ->with('employee')
            ->allowedFilters($filters)
            ->allowedSorts($fields)
            ->jsonPaginate(5000);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserData $userRequest)
    {
        $userData = $userRequest->toModel();
        $employee = Employee::create([
            'short_name' => $userData['name'],
            'fio' => $userData['name'],
            'chief' => $this->getChiefId($userData['chief']),
            'phone' => $userData['telephone'],
            'position_id' => 3,
        ]);

        if ($employee) {
            $user = new User;
            $user->name = $userData['name'];
            $user->status = $userData['status'];
            $user->email = $userData['email'];
            $user->email_verified_at = now();
            $user->password = Hash::make($userData['password']);
            $user->remember_token = Str::random(10);
            $user->profile()->associate($employee);
            $user->save();
            $user->roles()->attach($userData['role_id']);
            $user->save();

            return response()->json($user->load(['profile', 'roles']), 201);
        }

        return response()->json(['error' => 'Ошибка создания сотрудника'], 500);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return $user->loadMissing(['events.user','profile','roles']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserData $userRequest, User $user)
    {
        $data = $userRequest->toModel();
        $user->update($data);
        $profile = $user->profile;
        if($profile instanceof Employee){
            $profile->chief = $this->getChiefId($data['chief']);
            $profile->save();
        }
        return $this->show($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(null, 204);
    }
    private function getChiefId($chief) : int | null
    {
        $user = User::find($chief);
        if($user->profile){
            return $user->profile->id;
        }
        return null;
    }
}
