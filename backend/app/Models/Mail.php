<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mail extends Model
{
    use HasFactory;

    /**
     * Constructor.
     *
     * @param  array  $to
     * @param  array  $cc
     * @param  array  $bcc
     * @param  string  $content
     * @param  string  $from
     * @return string  $subject
     * @return string  $reply_to
     */
    public function __construct($to, $content, $from, $subject, $reply_to, $cc=null, $bcc=null)
    {
        $this->to = $to;
        $this->content = $content;
        $this->from = $from;
        $this->subject = $subject;
        $this->reply_to = $reply_to;
        $this->cc = $cc;
        $this->bcc = $bcc;
    }

    protected $to;

    protected $cc;

    protected $bcc;

    protected $content;

    protected $from;

    protected $subject;

    protected $reply_to;

    public function setTo($to){
        $this->to = $to;
    }

    public function setCc($cc){
        $this->cc = $cc;
    }

    public function setBcc($bcc){
        $this->bcc = $bcc;
    }

    public function setContent($content){
        $this->content = $content;
    }

    public function setFrom($from){
        $this->from = $from;
    }

    public function setSubject($subject){
        $this->subject = $subject;
    }

    public function setReplyTo($reply){
        $this->reply_to = $reply;
    }


    public function getTo(){
        return $this->to;
    }

    public function getCc(){
        return $this->cc;
    }

    public function getBcc(){
        return $this->bcc;
    }

    public function getContent(){
        return $this->content;
    }

    public function getFrom(){
        return $this->from;
    }

    public function getSubject(){
        return $this->subject;
    }

    public function getReplyTo(){
        return $this->reply_to;
    }

    


}
