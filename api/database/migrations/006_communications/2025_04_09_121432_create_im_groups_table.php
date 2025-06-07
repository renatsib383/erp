<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('im_groups', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('im_group_user', function (Blueprint $table) {
            $table->foreignId('im_group_id');
            $table->foreignId('user_id');
            $table->primary(['im_group_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('im_groups');
        Schema::dropIfExists('im_group_user');
    }
};
