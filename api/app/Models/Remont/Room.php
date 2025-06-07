<?php

namespace App\Models\Remont;

use App\Events\Room\Created;
use App\Events\Room\Updated;
use App\Models\BaseModel;
use App\Models\Deals\Deal;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends BaseModel
{
    use SoftDeletes;

    protected $dispatchesEvents = [
        'created' => Created::class,
        'updated' => Updated::class,
    ];

    protected $fillable = [
        'deal_id',
        'name',
        'room_type_id',
        's_floor',
        'p_floor',
        's_walls',
        'width',
        'length',
        'height',
        'doors_width',
        'perimeter',
        's_holes',
        'slopes_doors',
        'slopes_windows',
        'doors',
        'windows',
        'columns',
        'room_size',
        'sab_id',
    ];

    protected $casts = [
        's_floor' => 'float',
        'p_floor' => 'float',
        's_walls' => 'float',
        'height' => 'float',
        'doors_width' => 'float',
        'perimeter' => 'float',
        's_holes' => 'float',
        'slopes_doors' => 'float',
        'slopes_windows' => 'float',
        'doors' => 'array',
        'windows' => 'array',
        'columns' => 'array',
        'room_size' => 'array',
    ];

    protected $hidden = [
        'sab_id',
    ];

    public function deal(): BelongsTo
    {
        return $this->belongsTo(Deal::class);
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
    }
}
