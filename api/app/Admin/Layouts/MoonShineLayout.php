<?php

declare(strict_types=1);

namespace App\Admin\Layouts;

use App\Admin\Resources\Divisions\LegalEntityResource;
use App\Admin\Resources\Finance\CashRegisterResource;
use App\Admin\Resources\Finance\PaymentResource;
use MoonShine\Laravel\Layouts\CompactLayout;
use MoonShine\ColorManager\ColorManager;
use MoonShine\Contracts\ColorManager\ColorManagerContract;
use MoonShine\Laravel\Components\Layout\{Profile};
use MoonShine\UI\Components\{
    Layout\Div,
    Layout\Burger,
    Layout\Footer,
    Layout\Menu,
    Layout\Sidebar,
    Layout\ThemeSwitcher,
    When
};
use MoonShine\MenuManager\MenuGroup;
use MoonShine\MenuManager\MenuItem;
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
use MoonShine\UI\Fields\Select;
use Illuminate\Support\Facades\Vite;
use MoonShine\AssetManager\Js;
use MoonShine\AssetManager\CSS;

final class MoonShineLayout extends CompactLayout
{


    protected function assets(): array
    {
        return [
            ...parent::assets(),
            Js::make(Vite::asset('resources/js/app.js')),
            CSS::make(Vite::asset('resources/css/app.css'))
        ];
    }

    protected function inMenu($model_base_name){
        return auth()->user()->hasPermission($model_base_name, 'viewAny');
    }


    protected function menu(): array
    {
        return [
            MenuGroup::make('Пользователи и роли', [
                MenuItem::make('Пользователи', UserResource::class)->icon('user'),
                MenuItem::make('Роли', RoleResource::class),
            ]),
            MenuGroup::make('Подразделения', [
                MenuItem::make('Компании', CompanyResource::class),
                MenuItem::make('Юр лица', LegalEntityResource::class),
            ])->canSee(fn() => $this->inMenu('Company') || $this->inMenu('LegalEntity')),
            MenuGroup::make('Сотрудники', [
                MenuItem::make('Должности', PositionResource::class),
                MenuItem::make('Сотрудники', EmployeeResource::class),
            ]),
            MenuGroup::make('Сделки', [
                MenuItem::make('Сделки', DealResource::class),
                MenuItem::make('Этапы сделок', StageResource::class),
                MenuItem::make('Воронки', PipelineResource::class),
            ]),
            MenuGroup::make('Финансы', [
                MenuItem::make('Кассы', CashRegisterResource::class),
                MenuItem::make('ДДС', PaymentResource::class),
            ]),

            MenuGroup::make('Ремонт', [
                MenuItem::make('Типы комнат', RoomTypeResource::class),
            ]),
            MenuGroup::make('Работы', [
                MenuItem::make('Работы', WorkResource::class),
                MenuItem::make('Категории работ', WorkCategoryResource::class),
                MenuItem::make('Группы работ', WorkGroupResource::class),
                MenuItem::make('Коллекции работ', WorkCollectionResource::class),
            ]),
            MenuGroup::make('Материалы', []),

            MenuItem::make('Конфиг', YamlConfig::class)



        ];
    }

    protected function getFooterComponent(): Footer
    {
        return Footer::make()
            ->menu($this->getFooterMenu());
    }

    /**
     * @param ColorManager $colorManager
     */
    protected function colors(ColorManagerContract $colorManager): void
    {
        parent::colors($colorManager);

        // $colorManager->primary('#d98e00');
        // $colorManager->secondary('#fbc110');
        // $colorManager->successBg('0, 170, 0');
        // $colorManager->successText('255, 255, 255');
        // $colorManager->warningBg('255, 220, 42');
        // $colorManager->warningText('139, 116, 0');
        // $colorManager->errorBg('224, 45, 45');
        // $colorManager->errorText('255, 255, 255');
        // $colorManager->infoBg('0, 121, 255');
        // $colorManager->infoText('255, 255, 255');
    }


    protected function getSidebarComponent(): Sidebar
    {
        return Sidebar::make([
            Div::make([
                Div::make([
                    $this->getLogoComponent()->minimized(),
                ])->class('menu-heading-logo'),

                Div::make([
                    ThemeSwitcher::make(),

                    Div::make([
                        Burger::make(),
                    ])->class('menu-heading-burger'),
                ])->class('menu-heading-actions'),
            ])->class('menu-heading'),

            Div::make([
                Menu::make(),
                When::make(
                    fn(): bool => $this->isAuthEnabled(),
                    static fn(): array => [Profile::make(withBorder: true)],
                ),
            ])->customAttributes([
                'class' => 'menu',
                ':class' => "asideMenuOpen && '_is-opened'",
            ]),
        ])->collapsed();
    }
}
