<!DOCTYPE html>
<html lang="en">

<head>
    <title>Смета {{ $smet['n'] }} от {{ $smet['date'] }}г.</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @include('Pdf.styles')
</head>
<body>

@php
    $total = 0;
    $s_walls = 0;
    $s_floor = 0;
@endphp
@include('Pdf.header')
@include('Pdf.footer')
@include('Pdf.first_page',['num'=>1, 'doc_name' => 'Смета '.$smet['n'].' от '.$smet['date']])
<tocpagebreak links="on" />
@foreach ($rooms as $roomId => $room)
    @include('Pdf.tables.smet', ['works' => $room['works'], 'total'=>$room['total'], 'room'=>$roomsList[$roomId]])
@endforeach
<h1 class="h-name-doc">Общая стоимость</h1>
<table cellspacing="0" class="calc test-doc">
    <tr>
        <th width="40%">Наименование</th>
        <th>Площадь стен (исключая проём), м2</th>
        <th>Площадь пола / потолока, м2</th>
        <th width="18%">Итого</th>
    </tr>


@foreach ($rooms as $roomId => $room)
        <tr>
            <td>{{ $roomsList[$roomId]['name'] }}</td>
            <td align="center">{{ $roomsList[$roomId]['s_walls']-$roomsList[$roomId]['s_holes'] }} м<sup>2</sup></td>
            <td align="center">{{ $roomsList[$roomId]['s_floor'] }} м<sup>2</sup></td>
            <td align="center">{{ Number::format($room['total'], precision: 2, locale: 'ru') }} р.</td>
        </tr>
        @php
            $total += $room['total'];
            $s_walls += $roomsList[$roomId]['s_walls']-$roomsList[$roomId]['s_holes'];
            $s_floor += $roomsList[$roomId]['s_floor'];
        @endphp
@endforeach
    <tr class="total-price">
        <td align="right">ИТОГО:</td>
        <td align="center">{{ $s_walls }} м<sup>2</sup></td>
        <td align="center">{{ $s_floor }} м<sup>2</sup></td>
        <td align="center">{{ Number::format($total, precision: 2, locale: 'ru') }} р.</td>
    </tr>
</table>
</body>
</html>
