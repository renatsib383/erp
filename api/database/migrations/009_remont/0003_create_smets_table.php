<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('smets', function (Blueprint $table) {
            $table->id();

            $table->boolean('approved')->default(false)->comment('Утверждена');
            $table->boolean('act_rooms')->default(false)->comment('Акты разбиты комнатам');
            $table->foreignId('deal_id')->index()->comment('Сделка');
            $table->foreignId('sab_ver')->nullable()->comment('Sab ver');
            $table->string('name')->comment('Название');
            $table->decimal('total',10)->default(0)->comment('Сумма');
            $table->decimal('discount',10)->default(0)->comment('Скидка');
            $table->decimal('total_discount',10)->default(0)->comment('Сумма со скидкой');
            $table->text('comment')->nullable()->comment('Комментарии');
            $table->json('rooms')->nullable()->comment('Комнаты');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('smets');
    }
};
