<?php

/**
 * @package     Joomla.Site
 * @subpackage  Templates.cassiopeia_cdf
 *
 * Sous-catégories d'une page catégorie (ex. « Crèmes » dans « Préparations ») :
 * affichées en cartes, avec l'image de la catégorie (onglet Options de la catégorie)
 * et le nombre de recettes.
 */

defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Router\Route;
use Joomla\Component\Content\Site\Helper\RouteHelper;

/** @var \Joomla\Component\Content\Site\View\Category\HtmlView $this */
$groups = $this->getCurrentUser()->getAuthorisedViewLevels();

if ($this->maxLevel == 0 || empty($this->children[$this->category->id])) {
    return;
}
?>
<ul class="cdf-cats cdf-subcats">
    <?php foreach ($this->children[$this->category->id] as $child) : ?>
        <?php if (!in_array($child->access, $groups)) {
            continue;
        } ?>
        <?php if (!$this->params->get('show_empty_categories') && !$child->numitems && !count($child->getChildren())) {
            continue;
        } ?>
        <?php
        $image    = $child->getParams()->get('image');
        $imageAlt = $child->getParams()->get('image_alt', '');
        $count    = (int) $child->getNumItems(true);
        ?>
        <li>
            <a class="cdf-card__link" href="<?php echo Route::_(RouteHelper::getCategoryRoute($child->id, $child->language)); ?>">
                <span class="cdf-card__media">
                    <?php if ($image) : ?>
                        <?php echo LayoutHelper::render('joomla.html.image', [
                            'src'     => $image,
                            'alt'     => $imageAlt,
                            'loading' => 'lazy',
                        ]); ?>
                    <?php endif; ?>
                </span>
                <h2 class="cdf-card__title"><?php echo $this->escape($child->title); ?></h2>
                <span class="cdf-card__desc">
                    <?php echo $count; ?> recette<?php echo $count > 1 ? 's' : ''; ?>
                </span>
            </a>
            <?php if ($this->params->get('show_subcat_desc') == 1 && $child->description) : ?>
                <div class="cdf-subcats__desc">
                    <?php echo HTMLHelper::_('content.prepare', $child->description, '', 'com_content.category'); ?>
                </div>
            <?php endif; ?>
        </li>
    <?php endforeach; ?>
</ul>
