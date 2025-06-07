<style>
    @page :first {
        size: 210mm 297mm;
        background: url("{{ public_path('assets/pdf/cover.png') }}") no-repeat bottom right;
        header: none;
        footer: none;
        margin: 0;
        padding: 0;
    }
    .cover {
        text-align: center;
        width: 100%;
    }
    .cover h2 {
        padding-top: 50%;
    }
</style>
<div class="cover">
    <h2>Приложение №{{ $num }}</h2>
    <p>К договору {{ $deal['uid'] }} от {{ $deal['date'] }}г.</p>
    <p>{{ $doc_name }}</p>
</div>
