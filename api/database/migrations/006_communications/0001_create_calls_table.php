<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calls', function (Blueprint $table) {
            $table->id();

            $table->enum('type', ['in', 'out', 'lost'])->comment('Тип');
            $table->foreignId('deal_id')->index()->comment('Сделка');
            $table->string('client_phone')->comment('Телефон клиента ');
            $table->string('user_phone')->comment('Телефон компании');
            $table->string('uis_login')->nullable()->comment('uis_login');
            $table->string('scenario')->nullable()->comment('Сценарий');
            $table->json('employee')->nullable()->comment('Сотрудник');
            $table->json('record')->nullable()->comment('Запись');

            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('calls');
    }
};
