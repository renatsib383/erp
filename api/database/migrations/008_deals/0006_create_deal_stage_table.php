<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deal_stage', function (Blueprint $table) {
            $table->foreignId('deal_id');
            $table->foreignId('stage_id');
            $table->primary(['deal_id', 'stage_id']);
        });

    }


    public function down(): void
    {
        Schema::dropIfExists('deal_stage');
    }
};
