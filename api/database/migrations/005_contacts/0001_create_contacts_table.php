<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();

            $table->string('surname', 255)->nullable()->comment('Фамилия');
            $table->string('name', 255)->nullable()->comment('Имя');
            $table->string('patronymic', 255)->nullable()->comment('Отчество');
            $table->string('phone', 255)->nullable()->comment('Телефон');
            $table->string('email', 255)->nullable()->comment('E-mail');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
