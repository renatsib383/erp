<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BaseModel extends Model
{
    public function toEventText(): string
    {
        return isset($this->name) ? $this->name : '';
    }
}
