<!DOCTYPE html>
<html lang="en">

<head>
    <title>Акт {{ $act['n'] }} от {{ $act['date'] }}г.</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @include('Pdf.styles')
</head>
<body>
    @include('Pdf.header')
    @include('Pdf.footer')
    @php
    $total = 0;
    @endphp
    <table class="logo" width="100%">
        <tr>
            <td rowspan="2">{{--<img height="56px" src="/source/image/sab_logo.svg" alt="">--}}</td>
            <td align="right" class="phone">+7 (234) 343-14-11</td>
        </tr>
        <tr>
            <td align="right" class="email">dsfsd</td>
        </tr>
    </table>
    <br>
    <p class="h-name-doc">Акт {{ $act['n'] }} от {{ $act['date'] }}г.</p>
    <table class="info-object" width="100%">
        {{--<tr class="name-document">
            <td colspan="2">Акт выполненных работ № {{ $act['n'] }} от {{ $act['date'] }}г.</td>
        </tr>--}}
        <tr class="info-document">
            <td colspan="2">По договору №{{ $deal['uid'] }} от {{ $deal['date'] }}г.</td>
        </tr>
        <tr class="info-document">
            <td colspan="2">Адрес объекта: {{ $deal['address'] }}</td>
        </tr>
    </table>
            @foreach ($works as $roomId => $room)
                @if($roomId>0)<h1 class="h-name-doc">{{ $rooms[$roomId]['name'] }}</h1>@endif
                @include('Pdf.tables.act', ['works' => $room])
                @php($total += $room['total'])
            @endforeach
    <table class="main">
    <tr class="total-price">
        <td colspan="4">ИТОГО К ОПЛАТЕ. СТОИМОСТЬ РАБОТ</td>
        <td align="right">{{ Number::format($total, precision: 2, locale: 'ru') }} р.</td>
    </tr>
    </table>
    <p style="font-size: 15px" align="center">Работы согласно акту, выполнены в полном объеме, претензий по качеству и срокам не имею.</p>
</body>

</html>
