<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('type')->nullable()->comment('Тип операции');
            $table->float('total')->nullable()->default(0)->comment('Сумма');
            $table->string('item')->nullable()->comment('Статья');
            $table->text('comment')->nullable()->comment('Комментарий ');
            $table->dateTime('date_transaction')->nullable()->comment('Дата проведения операции');
            $table->tinyInteger('direction')->nullable()->comment('Направление');
            $table->integer('deal_id')->nullable()->comment('Сделка');
            $table->integer('contact_id')->nullable()->comment('Клиент');
            $table->integer('cash_register_id')->nullable()->comment('Касса');
            $table->integer('company_id')->nullable()->comment('Компания');
            $table->integer('user_id')->nullable()->comment('Кто добавил');

            $table->tinyInteger('payment_type')->nullable()->comment('Тип оплаты (наличные, Р/С, перевод на карту НУ)');
            $table->integer('fotr')->nullable()->comment('ФОТР');
            $table->json('files')->nullable()->comment('Сканы документов');
            $table->tinyInteger('status')->nullable()->comment('Статус (подготовка, в обработке, принят, не принят)');

            $table->integer('avance_sum')->nullable()->comment('Сумма аванса');
            $table->float('temp_deal_coef')->nullable()->comment('Коэффициент (временное поле)');
            $table->string('temp_deal_uid')->nullable()->comment('ид сделки (временное поле)');
            $table->integer('temp_deal_skidka')->nullable()->comment('скидка по сделке (временное поле)');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
