<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_products', function (Blueprint $table) {
            $table->foreignId('work_id');
            $table->foreignId('product_id');
            $table->float('count');

            $table->primary(['work_id', 'product_id']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('work_products');
    }
};
