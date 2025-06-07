<?php

use App\Models\Works\WorkGroup;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('works', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sab_id')->nullable()->comment('Sab id');
            $table->string('name', 255)->nullable()->comment('Название');
            $table->float('price')->default(0)->comment('Цена');
            $table->float('default_value')->default(0)->comment('Объем по умолчанию');
            $table->foreignIdFor(WorkGroup::class)->default(0)->comment('Группа');
            $table->integer('factor')->default(0)->comment('Фактор');
            $table->integer('ed')->default(0)->comment('Единицы измерения');
            $table->integer('type')->default(0)->comment('Вид работ');
            $table->string('description', 255)->nullable()->comment('Комментарий');
            $table->integer('sort')->default(0)->comment('Порядок сортировки');

            $table->timestamps();
            $table->softDeletes();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('works');
    }
};
