<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();

            $table->string('fio')->nullable()->comment('ФИО');
            $table->string('phone')->nullable()->comment('Телефон');
            $table->string('email')->nullable()->comment('E-mail');
            $table->foreignId('chief')
                ->nullable()
                ->comment('Руководитель');
            $table->foreignId('position_id')->comment('Должность');

            $table->timestamps();
            $table->softDeletes();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
