<?php

namespace App\Models;

use App\Models\System\ModelEvent;
use App\Observers\ModelObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Traits\Filterable;
use NotificationChannels\WebPush\HasPushSubscriptions;

#[ObservedBy([ModelObserver::class])]
class User extends BaseModel implements AuthenticatableContract,AuthorizableContract,CanResetPasswordContract
{
    use HasApiTokens, HasPushSubscriptions, HasFactory, Authenticatable, Authorizable, CanResetPassword, MustVerifyEmail, Notifiable, Filterable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'status',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'profile_type',
        'profile_id',
        'disable_notification',
        'email_verified_at',
        'pivot',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'disable_notification'=>'array',
        ];
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasRole($roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    public function hasPermission($model_name, $permission_name)
    {
        $permissions = $this->permissions;
        if (isset($permissions[$model_name][$permission_name]) && $permissions[$model_name][$permission_name]) {
            return true;
        }
        return $this->hasRole('superadmin');
    }

    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }

    public function profile(): MorphTo
    {
        return $this->morphTo();
    }
    public function employee(): MorphTo
    {
        return $this->morphTo('employee','profile_type','profile_id')->select(['id']);
    }
    public function getPermissionsAttribute() : array
    {
        $result = ['permissions'=>[],'pipelines'=>[]];
        $roles = $this->roles()->select('permissions')->get();
        foreach ($roles as $role){
            if (!empty($role->permissions)) {
                $permissions = $role->permissions;
                if(isset($permissions['pipelines'])){
                    $pipelines = $permissions['pipelines'];
                    unset($permissions['pipelines']);
                }else{
                    $pipelines = [];
                }
                foreach ($permissions as $name => $settings){
                    foreach ($settings as $key=>$value){
                        if($value == 1){
                            $result['permissions'][$name][$key] = 1;
                        }
                    }
                }
                foreach ($pipelines as $pipeline => $settings){
                    foreach ($settings as $name=>$value){
                        if($value == 1){
                            $result['pipelines'][$pipeline][$name][$value] = 1;
                        }
                        if($name === 'stages'){
                            foreach ($value as $index => $stageValue){
                                if($stageValue == 1){
                                    $result['pipelines'][$pipeline]['stages'][$index] = 1;
                                }
                            }
                        }
                    }
                }
            }
        }
        return $result;
    }
}
