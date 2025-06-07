<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('model_events', function (Blueprint $table) {
            $table->id();

            $table->morphs('eventable');
            $table->enum('type', ['created', 'updated', 'deleted', 'restored', 'comment'])->comment('Тип');
            $table->json('data')->comment('Данные');
            $table->text('text')->nullable();
            $table->foreignIdFor(User::class, 'user_id')->comment('Пользователь');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('model_events');
    }
};
