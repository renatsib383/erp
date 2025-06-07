<?php

declare(strict_types=1);

namespace App\Admin\Resources;

use App\Admin\Components\ModelEventsComponent;
use App\Models\Contacts\Contact;
use App\Models\User;
use App\Models\Role;
use App\Models\Staff\Employee;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\UI\Components\Layout\Flex;
use MoonShine\UI\Components\Collapse;
use MoonShine\Laravel\Fields\Relationships\BelongsToMany;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Fields\Password;
use MoonShine\UI\Fields\PasswordRepeat;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Email;
use MoonShine\UI\Fields\Date;
use MoonShine\Laravel\Fields\Relationships\MorphTo;
use MoonShine\UI\Components\Tabs;
use MoonShine\UI\Components\Tabs\Tab;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\UI\Components\Badge;

/**
 * @extends ModelResource<User>
 */
class UserResource extends ModelResource
{
    protected string $model = User::class;

    protected string $title = 'Users';

    private array $models = [
        'Company'=>'Компании',
        'LegalEntity'=>'Юр. лица',
        'User'=> 'Пользователи',
        'Role'=>'Роли',
        'Contact'=>'Контакты',
        'Deal'=>'Сделки',
        'Task'=>'Задачи',
        'CashRegister'=>'Кассы',
        'Dds'=>'ДДС',
        'Act'=>'Акты',
        'Room'=>'Комнаты',
        'RoomType'=>'Типы комнат',
        'Smet'=>'Сметы',
        'Employee'=>'Сотрудники',
        'Position'=>'Должности',
        'Work'=>'Работы',
        'WorkCategory'=>'Категории работ',
        'WorkGroup'=>'Группы работ',
        'WorkCollection'=>'Наборы работ',
        'WorkProduct'=>'Расходники для работ',
    ];

    /**
     * @return list<FieldContract>
     */
    protected function indexFields(): iterable
    {
        return [
            ID::make()->sortable(),
            Text::make('Имя', 'name'),
            Email::make('Email', 'email'),
            BelongsToMany::make('Роли', 'roles', formatted: static fn (Role $model) => $model->name,
            resource: RoleResource::class,
        )->inLine(separator: ' ', badge: fn($model, $value) => Badge::make((string) $value, 'primary')),
            Date::make('Дата создания', 'created_at')->format('d.m.Y'),
            Date::make('Дата обновления', 'updated_at')->format('d.m.Y'),
        ];
    }
    private function getNotificationFields(): array
    {
        $modelsList = config('atlon.list.models');
        $userPermissions = $this->getItem()?->getPermissionsAttribute();
        $permissionList = $userPermissions['permissions'] ?? [];
        $disable_notification = [];
        foreach ($permissionList as $key => $settings){
            if(isset($modelsList[$key]) && isset($settings['view']) && $settings['view']==1){
                $fields = [
                    Switcher::make('Центр уведомлений', 'db'),
                    Switcher::make('Высплывающие', 'ws'),
                ];
                //$fields[] = Switcher::make('На мобильном / Рабочем столе компьютера', 'push');
                $disable_notification[] = Collapse::make('Отключить уведомления для раздела: '.$modelsList[$key],[
                    Json::make('', 'disable_notification.'.$key)
                        ->fields($fields)->object(),
                ]);
            }
        }
        return $disable_notification;
    }
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function formFields(): iterable
    {
        return [
            Box::make([
                Tabs::make([
                    Tab::make('Основная информация', [
                        ID::make()->sortable(),
                        //BelongsToMany::make('Роли', 'roles', formatted: static fn (Role $model) => $model->name)->selectMode(),
                        Flex::make([
                            Text::make('Имя', 'name')
                                ->required(),

                            Email::make('Email', 'email')
                                ->required(),
                            MorphTo::make('Профиль','profile')->types([
                                Employee::class => ['fio', 'Сотрудник'],
                                Contact::class => ['full_name', 'Клиент']
                            ])->nullable()
                        ]),
                        BelongsToMany::make(
                            'Роли',
                            'roles',
                            formatted: 'name',
                            resource: RoleResource::class
                        )
                    ])->icon('user-circle'),
                    Tab::make('Отключить уведомления', $this->getNotificationFields())->icon('bell-alert'),
                    Tab::make('Пароль', [
                        Collapse::make('Изменить пароль', [
                            Password::make('Пароль', 'password')
                                ->customAttributes(['autocomplete' => 'new-password'])
                                ->eye(),

                            PasswordRepeat::make('Повторите пароль', 'password_repeat')
                                ->customAttributes(['autocomplete' => 'confirm-password'])
                                ->eye(),
                        ])->icon('lock-closed'),
                    ])->icon('lock-closed'),

                    Tab::make('Журнал изменений', [
                        ModelEventsComponent::make($this)
                    ])->icon('tag'),
                ]),
            ]),
        ];
    }

    /**
     * @return list<FieldContract>
     */
    protected function detailFields(): iterable
    {
        return [
            ID::make(),
        ];
    }

    /**
     * @param User $item
     *
     * @return array<string, string[]|string>
     * @see https://laravel.com/docs/validation#available-validation-rules
     */
    protected function rules(mixed $item): array
    {
        return [];
    }
}
