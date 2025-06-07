<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Spatie\Image\Exceptions\CouldNotLoadImage;
use Spatie\ImageOptimizer\OptimizerChainFactory;
use Spatie\Image\Image;


class MessageImageOptimize implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Model $message)
    {

    }

    /**
     * Execute the job.
     * @throws CouldNotLoadImage
     */
    public function handle(): void
    {

        $disk = isset($this->message->room) ? 'chat' : 'feed';
        if (isset($this->message->file['url'])) {
            $file = $this->message->file;
            $filePath = Storage::disk($disk)->path($file['url']);
            $optimizerChain = OptimizerChainFactory::create();
            $optimizerChain->optimize($filePath);

            $filePathParts = explode('/', $file['url']);
            $thumbName = $filePathParts[0].'/t-'.$filePathParts[1];

            Image::load($filePath)
                ->width(400)
                ->height(400)
                ->save(Storage::disk($disk)->path($thumbName));

            $file['thumb'] = $thumbName;

            $this->message->file = $file;

            $this->message->save();
        }

    }
}
