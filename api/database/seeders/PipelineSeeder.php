<?php

namespace Database\Seeders;

use App\Models\Deals\Pipeline;
use App\Models\Deals\Stage;
use Illuminate\Database\Seeder;

class PipelineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Pipeline::create(['id'=>1,'name'=>'Отделка квартир']);
        $stages = array(
            array('id' => '1','title' => 'На распределение','color' => '#efefef','pipeline_id' => 1),
            array('id' => '2','title' => 'Распределены','color' => '#ffffff','pipeline_id' => 1),
            array('id' => '3','title' => 'Удаленный расчет','color' => '#ffe39b','pipeline_id' => 1),
            array('id' => '4','title' => 'Выезд состоялся','color' => '#b4d9a3','pipeline_id' => 1),
            array('id' => '5','title' => 'Согласование сметы','color' => '#fefefe','pipeline_id' => 1),
            array('id' => '6','title' => 'Отказ','color' => '#e89a96','pipeline_id' => 1),
            array('id' => '7','title' => 'Передан в производство','color' => '#4db8ca','pipeline_id' => 1),
            array('id' => '8','title' => 'Объект на открытие','color' => '#d9d9d9','pipeline_id' => 1),
            array('id' => '9','title' => 'Объект без мастеров','color' => '#ffe39d','pipeline_id' => 1),
            array('id' => '10','title' => 'Объект в работе','color' => '#ffffff','pipeline_id' => 1),
            array('id' => '11','title' => 'Заморожен','color' => '#a4c2f4','pipeline_id' => 1),
            array('id' => '12','title' => 'В юр. отделе','color' => '#e89a96','pipeline_id' => 1),
            array('id' => '13','title' => 'Объект закрыт не по вине Прораба','color' => '#ffe49b','pipeline_id' => 1),
            array('id' => '14','title' => 'Объект закрыт','color' => '#b6d7a8','pipeline_id' => 1)
        );
        foreach ($stages as $stage){
            Stage::create($stage);
        }
    }
}
