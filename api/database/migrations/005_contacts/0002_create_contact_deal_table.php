<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_deal', function (Blueprint $table) {
            $table->foreignId('deal_id');
            $table->foreignId('contact_id');

            $table->primary(['deal_id', 'contact_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
        Schema::dropIfExists('contact_deal');
    }
};
