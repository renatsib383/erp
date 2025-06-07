<?php

declare(strict_types=1);

namespace App\Admin\Pages\Role;

use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\UI\Components\Tabs;
use MoonShine\UI\Components\Tabs\Tab;
use MoonShine\UI\Fields\Checkbox;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Components\Collapse;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Json;
use Throwable;
use App\Models\Deals\Pipeline;

class RoleFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     * @throws Throwable
     */

    public function stagesPermissions($pipeline): array
    {
        $stages = $pipeline->stages;
        $stage_fields_components = [];
        foreach ($stages as $stage) {
            $stage_fields_components[] = Checkbox::make($stage->title, 'stages.' . $stage->id);

        }
        return $stage_fields_components;
    }

    protected function fields(): iterable
    {
        $pipelines = Pipeline::all();

        $pipelines_stages = [];

        foreach ($pipelines as $pipeline) {
            $pipelines_stages[] =  Collapse::make($pipeline->name, [
                Json::make('', 'permissions.pipelines.' . $pipeline->id)
                    ->fields([
                        Switcher::make('Доступность воронки', 'access')->onApply(function ($item,$value){
                            $item['access'] = match ($value) {
                                "1" => 1,
                                default => 0,
                            };
                            return $item;
                        }),
                        ...$this->stagesPermissions($pipeline)
                    ])->object()->onApply(function ($item){
                        $permissions = $item->permissions;
                        foreach ($permissions['pipelines'] as &$pipeline){
                            if(isset($pipeline['access']) && $pipeline['access']==1){
                                $pipeline['access'] = 1;
                            }else{
                                $pipeline['access'] = 0;
                            }
                            foreach ($pipeline['stages'] as $stage => $value){
                                if($value==1){
                                    $pipeline['stages'][$stage] = 1;
                                }else{
                                    unset($pipeline['stages'][$stage]);
                                }
                            }

                        }
                        $item->permissions = $permissions;
                        return $item;
                    }),
            ]);

        }
        $crud = [];
        foreach (config('atlon.list.models') as $key => $name){
            $crud[] = Collapse::make($name,[
                Json::make('', 'permissions.'.$key)
                    ->fields([
                        Switcher::make('Просмотр списка', 'viewAny'),
                        Switcher::make('Просмотр записи', 'view'),
                        Switcher::make('Создание', 'create'),
                        Switcher::make('Изменение', 'update'),
                        Switcher::make('Удаление', 'delete'),
                        Switcher::make('Журнал', 'history'),
                    ])->object(),
            ]);
        }
        return [
            Tabs::make([
                Tab::make('Основная информация', [
                    Text::make('Название', 'name')->required(),
                    Text::make('Guard name', 'guard_name')->required(),
                ])->icon('tag'),
                Tab::make('Разрешения', $crud)->icon('tag'),
                Tab::make('Воронки и этапы', [
                    ...$pipelines_stages
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
