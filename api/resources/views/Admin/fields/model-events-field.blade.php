<div>
<?php foreach ($events as $event): ?>
        <div class="box">
            <?php echo $event->created_at->format('d.m.Y H:i') ?> <br>
            <?php echo $event->text ?>
            <?php echo $event->user->name ?> 
        </div>
        <br>
    <?php endforeach; ?>
</div>