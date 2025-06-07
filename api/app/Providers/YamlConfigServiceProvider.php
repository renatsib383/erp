<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Symfony\Component\Yaml\Yaml;
use Illuminate\Config\Repository;

class YamlConfigServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->booted(function () {

            $fieldsYamlConfigs = glob(config_path('atlon/models/*/*.yaml'));
            $fieldsYamlConfigs = array_merge($fieldsYamlConfigs,glob(config_path('atlon/models/*.yaml')));

            foreach ($fieldsYamlConfigs as $fieldsYamlConfig) {
                try {
                    $yaml = Yaml::parseFile($fieldsYamlConfig);
                } catch (\Exception $e) {
                    abort(500, 'Ошибка при разборе YAML файла: ' . $e->getMessage());
                }


                $configName = basename($fieldsYamlConfig, '.yaml');

                $config = $this->app->make(Repository::class);

                foreach ($yaml as $key => $value) {
                    $config->set('atlon.models.'.$configName.'.'.$key, $value);
                }
            }
        });
    }
}
