<?php

use App\Models\Deals\Pipeline;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stages', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->string('color')->nullable();
            $table->foreignId('amo_id')->nullable()->comment('AMO id');
            $table->foreignId('sab_id')->nullable()->comment('Sab id');
            $table->foreignIdFor(Pipeline::class)->default(1);

            $table->timestamps();
            $table->softDeletes();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('stages');
    }
};
