<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_position', function (Blueprint $table) {
            $table->foreignId('company_id')->comment('Компания');
            $table->foreignId('position_id')->comment('Должность');
            $table->integer('salary')->default(0)->comment('Оклад');

            $table->primary(['company_id', 'position_id']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('company_position');
    }
};
