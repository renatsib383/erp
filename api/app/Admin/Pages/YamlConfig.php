<?php

declare(strict_types=1);

namespace App\Admin\Pages;

use MoonShine\Laravel\Pages\Page;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Laravel\Http\Responses\MoonShineJsonResponse;
use MoonShine\UI\Components\FormBuilder;
use App\Admin\Fields\YamlField;
use Symfony\Component\Yaml\Yaml;
use Illuminate\Http\Request;
use MoonShine\Support\Enums\ToastType;

class YamlConfig extends Page
{
    /**
     * @return array<string, string>
     */
    public function getBreadcrumbs(): array
    {
        return [
            '#' => $this->getTitle()
        ];
    }

    public function getTitle(): string
    {
        return $this->title ?: 'YamlConfig';
    }

    /**
     * @return list<ComponentContract>
     */
    protected function components(): iterable
    {
        return [
            FormBuilder::make('/save-config')
                ->fields([
                    YamlField::make(),
                ])->async()
        ];
    }

    public function saveConfig(Request $request)
    {
        $yamlText = $request->input('config_file');
        try {
            Yaml::parse($yamlText);
            file_put_contents(base_path('config/atlon/common.yaml'), $yamlText);
            return MoonShineJsonResponse::make()->toast('Saved', ToastType::SUCCESS);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }

       
    }
}
