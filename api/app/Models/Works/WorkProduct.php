<?php

namespace App\Models\Works;

use App\Models\BaseModel;
//use App\Models\Product;
use Illuminate\Database\Eloquent\Relations\HasOne;

class WorkProduct extends BaseModel
{
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'work_id',
        'count',
    ];
/*
    public function product(): HasOne
    {
        return $this->hasOne(Product::class, 'product_id', 'product_id');
    }
*/
    public function work(): HasOne
    {
        return $this->hasOne(Work::class, 'id', 'work_id');
    }
}
