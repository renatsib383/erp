<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->boolean('final_act')->default(false)->after('status')->comment('Финальный акт');
            $table->float('partial_payment')->nullable()->after('final_act')->comment('Частичная оплата');
            $table->float('deposit_minus')->nullable()->after('partial_payment')->comment('С депозита');
            $table->float('discount_minus')->nullable()->after('deposit_minus')->comment('Скидка');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn([
                'final_act',
                'partial_payment',
                'deposit_minus',
                'discount_minus',
            ]);
        });
    }
};
/*

'final_act' => ['nullable','boolean'],
'partial_payment' => ['nullable', 'numeric'],
'deposit_minus' => ['nullable', 'numeric'],
'discount_minus' => ['nullable', 'numeric'],

 */
