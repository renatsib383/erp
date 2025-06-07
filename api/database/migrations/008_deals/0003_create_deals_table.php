<?php

use App\Models\Deals\Pipeline;
use App\Models\Deals\Stage;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deals', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(Pipeline::class)->default(1)->comment('Воронка');
            $table->foreignIdFor(Stage::class)->default(1)->comment('Статус/Этап');
            $table->foreignId('sab_id')->nullable()->comment('Sab id');
            $table->foreignId('amo_id')->nullable()->unique()->comment('Amo Lead id');
            $table->date('amo_sync')->nullable()->comment('Amo Sync Time');
            $table->integer('company_id')->default(1)->comment('Компания');
            $table->string('uid', 255)->nullable()->comment('ИД');
            $table->string('region', 255)->nullable()->comment('Регион');
            $table->string('address', 255)->nullable()->comment('Адрес');
            $table->integer('temperature')->default(0)->comment('Лояльность клиента');
            $table->string('lead_source', 255)->nullable()->comment('Откуда узнали о нас');
            $table->integer('budget_sum')->default(0)->comment('Бюджет заказчика');
            $table->float('skidka')->default(0)->comment('Скидка');
            $table->boolean('deferred_discount')->default(false)->comment('Отложенная скидка');
            $table->boolean('deferred_skidka_paid')->default(false)->comment('Отложенная скидка выплачена');
            $table->float('coef')->default(1)->comment('Коэффициент');
            $table->json('price')->nullable()->comment('Прайс лист');
            $table->boolean('confirm_act')->default(false)->comment('Подтверждения акта сдачи-приемки');
            $table->float('coef_price_master')->nullable()->comment('Коэффициент для прайса мастера');
            $table->float('hold_master')->nullable()->comment('Удержка мастера');
            $table->float('forced_percent_master')->nullable()->comment('Принудительный процент мастера');
            $table->float('increase_master')->nullable()->comment('Увеличения для мастера (%)');
            $table->float('forced_percent_prorab')->nullable()->comment('Принудительный процент прораба');
            $table->decimal('confirmed_smet_sum',10)->default(0)->comment('Сумма по смете');
            $table->integer('additional_works_sum')->default(0)->comment('Сумма доп работ');
            $table->integer('facility_type')->default(0)->comment('Тип недвижимости');
            $table->integer('facility_condition')->default(0)->comment('Состояние недвижимости');
            $table->integer('renovation_type')->default(0)->comment('Тип ремонта');
            $table->date('date_start')->nullable()->comment('Дата начала ремонта');
            $table->date('date_end')->nullable()->comment('Дата конца ремонта');
            $table->json('geo')->nullable()->comment('GEO');
            $table->boolean('agent')->default(false)->comment('Агентский договор');
            $table->string('partner', 255)->nullable()->comment('Партнерка');
            $table->float('coef_additional_partner')->nullable()->comment('Добавочный коэффициент партнёра');
            $table->foreignId('responsible')->nullable()->comment('Ответственный');
            $table->foreignId('designer')->nullable()->comment('Дизайнер');
            $table->foreignId('operator')->nullable()->comment('КЦ1 ответственный за сделку');
            $table->foreignId('zamerman')->nullable()->comment('Замерщик');
            $table->foreignId('prorab')->nullable()->comment('Прораб');
            $table->date('zamer_date')->nullable()->comment('Дата выезда на замер');
            $table->time('zamer_time')->nullable()->comment('Время приезда на замер');

            $table->timestamps();
            $table->softDeletes();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('deals');
    }
};
