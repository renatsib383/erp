<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();

            $table->string('room');
            $table->foreignId('reply_to')->default(0)->comment('Ответ на ID');
            $table->json('file')->nullable();
            $table->text('text')->nullable();
            $table->string('audio')->nullable()->comment('Ссылка на голосовое');
            $table->foreignIdFor(User::class, 'user_id');
            $table->foreignId('recipient')->nullable()->comment('Получатель');
            $table->string('phone', 255)->nullable()->comment('Телефон контакта');
            $table->boolean('is_viewed')->default(false)->comment('Просмотрено');
            $table->string('whatsapp_id')->nullable()->comment('Whatsapp ID');

            $table->timestamps();
            $table->softDeletes();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
