<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pipelines', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->foreignId('amo_id')->nullable()->unique()->comment('AMO id');
            $table->foreignId('sab_id')->nullable()->comment('Sab id');
            $table->boolean('archive')->nullable()->comment('Архивный');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pipeline');
    }
};
