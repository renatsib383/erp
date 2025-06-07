<?php

use App\Models\Deals\Deal;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(Deal::class);
            $table->foreignId('sab_id')->nullable()->comment('Sab id');
            $table->json('file')->nullable();
            $table->text('text')->nullable();
            $table->foreignIdFor(User::class, 'user_id');
            $table->foreignId('recipient')->nullable()->comment('Получатель');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
