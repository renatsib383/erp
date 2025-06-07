<?php

declare(strict_types=1);

namespace App\Admin\Pages\Employee;

use App\Admin\Components\ModelEventsComponent;
use App\Admin\Resources\Staff\EmployeeResource;
use App\Admin\Resources\UserResource;
use App\Models\User;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Database\Eloquent\Builder;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Fields\Relationships\MorphOne;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\UI\Components\FieldsGroup;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\UI\Components\Layout\Column;
use MoonShine\UI\Components\Layout\Flex;
use MoonShine\UI\Components\Layout\Grid;
use MoonShine\UI\Components\Tabs;
use MoonShine\UI\Components\Tabs\Tab;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Email;
use MoonShine\UI\Fields\Field;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Textarea;
use Throwable;
use MoonShine\UI\Fields\Text;
class EmployeeFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Tabs::make([
                Tab::make('Основная информация', [
                    Grid::make([
                        Column::make([
                            Flex::make([
                                Text::make('ФИО', 'fio'),
                                Date::make('Дата рождения', 'birthday'),
                                Select::make('Пол', 'gender')
                                    ->options([
                                        'муж'=>'Мужской',
                                        'жен'=>'Женский',
                                    ])->nullable(),
                                Email::make('E-mail', 'email'),
                            ]),
                            Flex::make([
                                Text::make('Телефон личный', 'phone'),
                                Text::make('Адрес', 'address'),
                                Text::make('ИНН', 'inn'),
                                Text::make('СНИЛС', 'snils'),
                            ]),
                        ],
                         9),
                        Column::make([
                            Image::make('Фото', 'photo')->dir('employee')->removable(),
                        ],3)
                    ]),

                    Flex::make([
                        Text::make('Никнэйм', 'short_name'),
                        Text::make('Телефон рабочий', 'work_phone'),
                        BelongsTo::make('Компания', 'company',  formatted: 'name')->nullable(),
                        BelongsTo::make('Должность', 'position',  formatted: 'name')->nullable(),

                    ]),
                    Flex::make([
                        Text::make('ЗП', 'salary'),
                        Date::make('Дата приёма на работу', 'hired'),
                        Date::make('Дата увольнения', 'fired'),
                        BelongsTo::make('Руководитель', 'chief',  formatted: 'short_name', resource: EmployeeResource::class)
                            ->valuesQuery(fn(Builder $query, Field $field) => $query->whereIn('position_id', [2])->orderBy('short_name'))
                            ->nullable(),
                        BelongsTo::make('Пользователь','user',  formatted: 'name')->nullable()->onApply(function ($model,$value){
                            $oldUser = $model->user;
                            if($oldUser){
                                $oldUser->profile_type = null;
                                $oldUser->profile_id = null;
                                $oldUser->save();
                            }
                            if($value && $model->id){
                                $user = User::find($value);
                                $user->profile_type = 'App\Models\Staff\Employee';
                                $user->profile_id = $model->id;
                                $user->save();
                            }
                        })->nullable()
                    ])
                ])->icon('tag'),
                Tab::make('Паспорт', [
                    Json::make('', 'passport')
                        ->fields([
                            Text::make('Серия', 'serial'),
                            Text::make('Номер', 'number'),
                            Date::make('Дата выдачи', 'issue_date'),
                            Text::make('Кем выдан', 'issued'),
                            Text::make('Код подразделения', 'department'),
                            Textarea::make('Прописка', 'registration'),
                        ])->object()
                ])->icon('tag'),
                Tab::make('Сканы документов', [
                    Image::make('', 'documents')
                        ->multiple()
                        ->removable()
                ])->icon('tag'),
                Tab::make('Журнал изменений', [
                    ModelEventsComponent::make($this->getResource()),
                ])->icon('tag'),
            ]),
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function topLayer(): array
    {
        return [
            ...parent::topLayer()
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer()
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer()
        ];
    }
}
