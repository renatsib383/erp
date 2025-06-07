<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            $table->string('title')->nullable()->comment('Название');
            $table->text('description')->nullable()->comment('Описание');
            $table->boolean('completed')->default(false)->comment('Задача завершена');
            $table->timestamp('start')->comment('Дата/время начала');
            $table->integer('duration')->nullable()->comment('Продолжительность');
            $table->timestamp('end')->nullable()->comment('Дата/время окончания');
            $table->boolean('all_day')->default(false)->comment('Весь день');
            $table->foreignId('author')->comment('Автор');
            $table->foreignId('performer')->nullable()->comment('Исполнитель');
            $table->foreignId('type')->nullable()->comment('Тип');
            $table->foreignId('status')->nullable()->comment('Статус');
            $table->foreignId('deal_id')->nullable()->comment('Сделка');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
