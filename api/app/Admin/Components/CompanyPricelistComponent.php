<?php

declare(strict_types=1);

namespace App\Admin\Components;

use App\Models\Works\WorkCategory;
use Closure;
use MoonShine\UI\Components\MoonShineComponent;
use MoonShine\Laravel\Resources\ModelResource;

/**
 * @method static static make()
 */
final class CompanyPricelistComponent extends MoonShineComponent
{
    protected string $view = 'Admin.components.company-pricelist-component';
    private int $id;

    public function __construct(protected ModelResource $resource)
    {
        parent::__construct();

        $this->id = $resource->getItem()->id ?? 0;
    }

    /*
     * @return array<string, mixed>
     */
    protected function viewData(): array
    {
        $cfg = config('atlon.list.work');

        if  ($this->id) {   
            $categories = WorkCategory::with(['groups' => function($query) {
                
                $query->orderBy('sort');
            }, 'groups.works' => function($query) {
                $query->where('company_id', $this->id);
                $query->orderBy('sort');
            }])
                ->select(['id', 'name', 'room_types'])
                ->orderBy('sort')
                ->get();
    
            $data = [
                'categories' => $categories,
                'factors' => $cfg['factors'],
                'eds' => $cfg['eds'],
            ];
            return $data;
        }
        return [];
    }
}
