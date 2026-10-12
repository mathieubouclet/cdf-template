<?php

/**
 * @package     Joomla.Site
 * @subpackage  Templates.cassiopeia_cdf
 *
 * Carte recette pour les pages catégorie (vue blog) :
 * image d'introduction + titre de l'article, le tout cliquable.
 * Le texte d'introduction n'est pas affiché (il ne contenait que le titre).
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Router\Route;
use Joomla\Component\Content\Administrator\Extension\ContentComponent;
use Joomla\Component\Content\Site\Helper\RouteHelper;

/** @var \Joomla\Component\Content\Site\View\Category\HtmlView $this */

$item    = $this->item;
$params  = $item->params;
$canEdit = $params->get('access-edit');
$images  = json_decode($item->images ?? '{}');
$link    = Route::_(RouteHelper::getArticleRoute($item->slug, $item->catid, $item->language));
$title   = $this->escape($item->title);

$currentDate   = Factory::getDate()->format('Y-m-d H:i:s');
$isUnpublished = ($item->state == ContentComponent::CONDITION_UNPUBLISHED || $item->publish_up > $currentDate)
    || ($item->publish_down < $currentDate && $item->publish_down !== null);
?>
<article class="cdf-card<?php echo $isUnpublished ? ' system-unpublished' : ''; ?>">
    <a class="cdf-card__link" href="<?php echo $link; ?>">
        <span class="cdf-card__media">
            <?php if (!empty($images->image_intro)) : ?>
                <?php echo LayoutHelper::render('joomla.html.image', [
                    'src'     => $images->image_intro,
                    'alt'     => '',
                    'loading' => 'lazy',
                ]); ?>
            <?php endif; ?>
        </span>
        <h2 class="cdf-card__title"><?php echo $title; ?></h2>
    </a>

    <?php if ($canEdit) : ?>
        <?php echo LayoutHelper::render('joomla.content.icons', ['params' => $params, 'item' => $item]); ?>
    <?php endif; ?>

    <?php echo $item->event->afterDisplayContent; ?>
</article>
