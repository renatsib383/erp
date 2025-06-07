<?php

declare(strict_types=1);

namespace App\Providers;

use App\Admin\Resources\Divisions\LegalEntityResource;
use App\Admin\Resources\Finance\CashRegisterResource;
use App\Admin\Resources\Finance\PaymentResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;
use MoonShine\Contracts\Core\DependencyInjection\ConfiguratorContract;
use MoonShine\Contracts\Core\DependencyInjection\CoreContract;
use MoonShine\AssetManager\Js;
use MoonShine\Contracts\AssetManager\AssetManagerContract;
use MoonShine\Contracts\Core\ResourceContract;
use MoonShine\Laravel\DependencyInjection\MoonShine;
use MoonShine\Laravel\DependencyInjection\MoonShineConfigurator;
use App\Admin\Resources\UserResource;
use App\Admin\Resources\RoleResource;
use App\Admin\Resources\Divisions\CompanyResource;
use App\Admin\Resources\Deals\DealResource;
use App\Admin\Resources\Deals\StageResource;
use App\Admin\Resources\Deals\PipelineResource;
use App\Admin\Resources\Remont\RoomTypeResource;
use App\Admin\Resources\Staff\PositionResource;
use App\Admin\Resources\Staff\EmployeeResource;
use App\Admin\Resources\Works\WorkResource;
use App\Admin\Resources\Works\WorkCategoryResource;
use App\Admin\Resources\Works\WorkGroupResource;
use App\Admin\Resources\Works\WorkCollectionResource;
use App\Admin\Pages\YamlConfig;
use MoonShine\Laravel\Enums\Ability;

class MoonShineServiceProvider extends ServiceProvider
{
    /**
     * @param  MoonShine  $core
     * @param  MoonShineConfigurator  $config
     *
     */
    public function boot(CoreContract $core, ConfiguratorContract $config, AssetManagerContract $assets): void
    {
        // $config->authEnable();
        $config->authorizationRules(
            static function (ResourceContract $resource, User $user, Ability $ability, Model $item): bool {
                $model = class_basename($item);


                //исключения на время тестирования
                $temp_free_models = [
                    'User',
                    'Role',
                ];


                if(!in_array($model, $temp_free_models)) {

                    return $user->hasPermission($model, $ability->value);

                }
                return true;
            }
        );

        $core
            ->resources([


                UserResource::class,
                RoleResource::class,
                CompanyResource::class,
                DealResource::class,
                StageResource::class,
                PipelineResource::class,
                RoomTypeResource::class,
                PositionResource::class,
                EmployeeResource::class,
                WorkResource::class,
                WorkCategoryResource::class,
                WorkGroupResource::class,
                WorkCollectionResource::class,
                CashRegisterResource::class,
                PaymentResource::class,
                LegalEntityResource::class,
            ])
            ->pages([
                ...$config->getPages(),
                YamlConfig::class,
            ])
        ;
    }
}
