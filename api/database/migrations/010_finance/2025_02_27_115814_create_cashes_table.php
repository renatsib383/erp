<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cash_registers', function (Blueprint $table) {
            $table->id();
            $table->string('name',255);
            $table->json('directions')->nullable();
            $table->integer('sort')->default(0)->comment('Порядок');
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('cash_register_company', function (Blueprint $table) {
            $table->foreignId('cash_register_id');
            $table->foreignId('company_id');
            $table->primary(['cash_register_id', 'company_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_registers');
    }
};
