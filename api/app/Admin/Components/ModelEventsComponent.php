<?php

declare(strict_types=1);

namespace App\Admin\Components;

use App\Models\System\ModelEvent;
use MoonShine\Laravel\Resources\CrudResource;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\UI\Components\MoonShineComponent;
/**
 * @method static static make(CrudResource $resource)
 */
final class ModelEventsComponent extends MoonShineComponent
{
    protected string $view = 'Admin.components.model-events-component';
    private string $model;
    private int $id;
    public function __construct(protected ModelResource $resource)
    {
        $this->model = get_class($resource->getDataInstance());
        $this->id = $resource->getItem()->id ?? 0;
        parent::__construct();
    }

    /*
     * @return array<string, mixed>
     */
    protected function viewData(): array
    {
        $events = ModelEvent::where('eventable_type', $this->model);

        if ($this->id) {
            $events = $events->where('eventable_id', $this->id);
        }

        return [
            'events' => $events->orderBy('created_at', 'desc')->get()
        ];
    }
}
