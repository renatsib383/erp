<h1 class="h-name-doc">{{ $room['name'] }}</h1>
<table class="info-object" width="100%">
    <tr class="name-document">
        <td colspan="4">Смета от {{ $smet['date'] }}г.</td>
    </tr>
    <tr class="info-document">
        <td colspan="4">Приложение №1 к договору №{{ $deal['uid'] }} - от {{ $smet['date'] }}г.</td>
    </tr>
    <tr class="info-document">
        <td colspan="4">Адрес объекта: {{ $deal['address'] }}</td>
    </tr>
    <tr>
        <td>Периметр пола / потолка, м/п</td>
        <td align="right">{{ $room['p_floor'] }} / {{ $room['perimeter'] }}</td>
        <td>Длина, м/п</td>
        <td align="right">{{ Number::format($room['room_size']['a'], precision: 2) }}</td>
    </tr>
    <tr>
        <td>Площадь пола / потолка, м2</td>
        <td align="right">{{ $room['s_floor'] }}</td>
        <td>Ширина, м/п</td>
        <td align="right">{{ Number::format($room['room_size']['b'], precision: 2) }}</td>
    </tr>
    <tr>
        <td>Площадь стен (включая проём), м2</td>
        <td align="right">{{ $room['s_walls'] }}</td>
        <td>Высота, м/п</td>
        <td align="right">{{ $room['height'] }}</td>
    </tr>
    <tr>
        <td>Площадь стен (исключая проём), м2</td>
        <td align="right">{{ $room['s_walls']-$room['s_holes'] }}</td>
        <td>Проемы, м2</td>
        <td align="right">{{ $room['s_holes'] }}</td>
    </tr>
    <tr>
        <td>СМЕТНАЯ СТОИМОСТЬ ПО ПОМЕЩЕНИЮ</td>
        <td align="right">{{ Number::format($total, precision: 2, locale: 'ru') }} р.</td>
        <td>Откосы, м/п</td>
        <td align="right">{{ ($room['slopes_doors']+$room['slopes_windows']) }}</td>
    </tr>
</table>

<table class="main">
    <thead>
    <tr>
        <th>№ п.п.</th>
        <th>Наименование</th>
        <th>Значение</th>
        <th>Цена за ед.</th>
        <th width="135px">Итого</th>
    </tr>
    </thead>
    <tbody>
    @php
        $category = 0;
        $group = 0;
        $index = 1;
        $total = 0;
        $categoryTotal =0;
    @endphp

    @foreach ($works as $work => $value)
        @if($price[$work]['category']['id'] != $category)
            @if($category>0)
                <tr class="total-section">
                    <td align="right" colspan="4">Итого «{{ $categoryName  }}»</td>
                    <td align="right">{{ Number::format($categoryTotal, precision: 2, locale: 'ru') }} р.</td>
                </tr>
            @endif
            <tr class="object-work">
                <td colspan="5" style="text-align: center;">{{ $price[$work]['category']['name']  }}</td>
            </tr>
            @php
                $category = $price[$work]['category']['id'];
                $categoryName = $price[$work]['category']['name'];
                $categoryTotal = 0;
            @endphp
        @endif
        @if($price[$work]['group']['id'] != $group)
            <tr class="type-section-name">
                <td colspan="5" style="text-align: center;">{{ $price[$work]['group']['name']  }}</td>
            </tr>
            @php
                $group = $price[$work]['group']['id'];
            @endphp
        @endif
        @php
            $workTotal = $price[$work]['price']*$value;
            $total += $workTotal;
            $categoryTotal += $workTotal;
        @endphp
        <tr>
            <td style="text-align: center;">{{ $index++ }}</td>
            <td>{{ $price[$work]['name'] }}</td>
            <td style="text-align: right;">{{ $value }} {{ $price[$work]['ed'] }}</td>
            <td style="text-align: right;">{{ Number::format($price[$work]['price'], precision: 2, locale: 'ru') }}р.
            </td>
            <td style="text-align: right;">{{ Number::format($workTotal, precision: 2, locale: 'ru') }} р.</td>
        </tr>
    @endforeach
    <tr class="total-section">
        <td align="right" colspan="4">Итого «{{ $categoryName  }}»</td>
        <td align="right">{{ Number::format($categoryTotal, precision: 2, locale: 'ru') }} р.</td>
    </tr>
    </tbody>
</table>
