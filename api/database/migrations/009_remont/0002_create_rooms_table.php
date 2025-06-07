<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();

            $table->foreignId('deal_id')->comment('Сделка');
            $table->foreignId('sab_id')->nullable()->comment('Sab id');
            $table->string('name')->nullable()->comment('Название');
            $table->integer('room_type_id')->nullable()->comment('Тип комнаты');
            $table->json('room_size')->nullable()->comment('Размеры комнаты');
            $table->decimal('s_floor', 10, 2)->default(0)->comment('Площадь пола');
            $table->decimal('p_floor', 10, 2)->default(0)->comment('Периметр пола');
            $table->decimal('s_walls', 10, 2)->default(0)->comment('Площадь стен');
            $table->decimal('height', 10, 2)->default(0)->comment('Высота');
            $table->decimal('doors_width', 10, 2)->default(0)->comment('Ширина дверей');
            $table->decimal('perimeter', 10, 2)->default(0)->comment('Периметр');
            $table->decimal('s_holes', 10, 2)->default(0)->comment('Площадь проемов');
            $table->decimal('slopes_doors', 10, 2)->default(0)->comment('Откосы дверей');
            $table->decimal('slopes_windows', 10, 2)->default(0)->comment('Откосы окон');

            $table->json('doors')->nullable()->comment('Двери');
            $table->json('windows')->nullable()->comment('Окна');
            $table->json('columns')->nullable()->comment('Колонны');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
