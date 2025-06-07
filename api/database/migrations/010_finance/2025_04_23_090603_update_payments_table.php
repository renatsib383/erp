<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->integer('cash_register_recipient_id')->nullable()->comment('Касса получатель');

            $table->dropColumn('direction');
            $table->dropColumn('contact_id');
            $table->dropColumn('company_id');
            $table->dropColumn('avance_sum');
            $table->dropColumn('temp_deal_coef');
            $table->dropColumn('temp_deal_uid');
            $table->dropColumn('temp_deal_skidka');
            $table->dropColumn('payment_type');
            $table->dropColumn('fotr');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('cash_register_recipient_id');

            $table->tinyInteger('direction')->nullable()->comment('Направление');
            $table->integer('contact_id')->nullable()->comment('Клиент');
            $table->integer('company_id')->nullable()->comment('Компания');
            $table->integer('fotr')->nullable()->comment('ФОТР');

            $table->integer('avance_sum')->nullable()->comment('Сумма аванса');
            $table->float('temp_deal_coef')->nullable()->comment('Коэффициент (временное поле)');
            $table->string('temp_deal_uid')->nullable()->comment('ид сделки (временное поле)');
            $table->integer('temp_deal_skidka')->nullable()->comment('скидка по сделке (временное поле)');

        });
    }
};
