<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_collections', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sab_id')->nullable()->comment('Sab id');
            $table->string('name');
            $table->integer('room_type');
            $table->json('works');
            $table->integer('sort')->default(0)->comment('Порядок');
            $table->timestamps();
            $table->softDeletes();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('work_collections');
    }
};
