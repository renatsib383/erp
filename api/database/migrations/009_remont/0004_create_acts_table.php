<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('acts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('deal_id')->index()->comment('Сделка');
            $table->foreignId('sab_id')->nullable()->comment('Sab id');
            $table->integer('sab_ver')->nullable()->comment('Sab ver');
            $table->foreignId('user_id')->index()->comment('Кто добавил');
            $table->integer('status')->default(0)->comment('Статус');
            $table->date('date_sign')->nullable()->comment('Дата подписания');
            $table->date('date_paid')->nullable()->comment('Дата оплаты');
            $table->integer('total')->default(0)->comment('Сумма');
            $table->integer('additional')->default(0)->comment('Сумма доп работ');
            $table->json('works')->nullable()->comment('Список работ');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('acts');
    }
};
