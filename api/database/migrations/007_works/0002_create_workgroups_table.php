<?php

use App\Models\Works\WorkCategory;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_groups', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sab_id')->nullable()->comment('Sab id');
            $table->foreignIdFor(WorkCategory::class)->comment('Категория');
            $table->string('name', 255)->nullable()->comment('Название');
            $table->integer('sort')->default(0)->comment('Порядок');

            $table->timestamps();
            $table->softDeletes();
        });


    }
    public function down(): void
    {
        Schema::dropIfExists('work_groups');
    }
};
