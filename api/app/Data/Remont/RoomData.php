<?php

namespace App\Data\Remont;

use App\Data\BaseData;

class RoomData extends BaseData
{
    public function __construct(
        public int $deal_id,
        public ?int $id,
        public ?string $name,
        public ?int $room_type_id,
        public ?float $s_floor,
        public ?float $p_floor,
        public ?float $s_walls,
        public ?float $height,
        public ?float $doors_width,
        public ?float $perimeter,
        public ?float $s_holes,
        public ?float $slopes_doors,
        public ?float $slopes_windows,
        public ?array $doors,
        public ?array $windows,
        public ?array $columns,
        public ?array $room_size,
    ) {}

    public static function rules(): array
    {
        return [
            'deal_id' => ['required', 'exists:deals,id'],
            'name' => 'string',
            'room_type_id' => 'integer',
            's_floor' => 'numeric',
            'p_floor' => 'numeric',
            's_walls' => 'numeric',
            'height' => 'numeric',
            'doors_width' => 'numeric',
            'perimeter' => 'numeric',
            's_holes' => 'numeric',
            'slopes_doors' => 'numeric',
            'slopes_windows' => 'numeric',
            'doors' => 'array',
            'windows' => 'array',
            'columns' => 'array',
            'room_size' => 'array',
        ];
    }
}
