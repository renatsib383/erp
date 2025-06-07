<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('legal_entities', function (Blueprint $table) {
            $table->id();

            $table->string('full_name')->nullable()->comment('Наименование организации для документов');
            $table->string('short_name')->nullable()->comment('Краткое наименование организации для документов');
            $table->string('phone')->nullable()->comment('Телефон');
            $table->string('email')->nullable()->comment('Эл. почта');
            $table->string('website')->nullable()->comment('Сайт');
            $table->string('city')->nullable()->comment('Город');
            $table->string('legal_address')->nullable()->comment('Юр. адрес');
            $table->string('director')->nullable()->comment('ФИО генерального директора');
            $table->string('glavbuh')->nullable()->comment('ФИО главного бухгалтера');
            $table->string('inn')->nullable()->comment('ИНН');
            $table->string('kpp')->nullable()->comment('КПП');
            $table->string('ogrn')->nullable()->comment('ОГРН');
            $table->string('okpo')->nullable()->comment('ОКПО');
            $table->string('oktmo')->nullable()->comment('ОКТМО');
            $table->json('bank_accounts')->nullable()->comment('Реквизиты банка');
            $table->date('registration_date')->nullable()->comment('Дата гос. регистрации');
            $table->string('facsimile')->nullable()->comment('Факсимиле');
            $table->string('stamp')->nullable()->comment('Печать');
            $table->string('logo')->nullable()->comment('Логотип');
            $table->integer('sort')->default(0)->comment('Порядок сортировки');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('legal_entities');
    }
};
