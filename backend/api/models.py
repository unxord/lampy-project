from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils import timezone
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)

class CommonContentItem(models.Model):
    class PageType(models.TextChoices):
        HOME = 'home', _('Главная (Home)')
        ABOUT = 'about', _('О нас (About)')
        HELP = 'help', _('Помощь (Help)')

    page = models.CharField(
        _("Страница"),
        max_length=20,
        choices=PageType.choices,
        default=PageType.HOME,
        db_index=True,
        help_text=_("Страница, на которой будет отображаться этот контент.")
    )
    title = models.CharField(
        _("Заголовок"),
        max_length=255
    )
    content = models.TextField(
        _("Содержимое")
    )
    read_more_link = models.URLField(
        _("Ссылка 'Читать далее'"),
        blank=True,
        null=True
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("Автор (Пользователь)"),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='common_content_items'
    )
    author_pseudonym = models.CharField(
        _("Псевдоним автора (переопределение)"),
        max_length=150,
        blank=True,
        null=True,
        help_text=_("Если указано, будет отображаться вместо имени пользователя.")
    )
    created_at = models.DateTimeField(
        _("Дата создания"),
        default=timezone.now
    )
    updated_at = models.DateTimeField(
        _("Дата обновления"),
        default=timezone.now
    )

    class Meta:
        verbose_name = _("Элемент общего контента")
        verbose_name_plural = _("Элементы общего контента")
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_page_display()}: {self.title}"
    
    def _invalidate_cache(self):
        try:
            key_prefix = getattr(settings, 'CACHES', {}).get('default', {}).get('KEY_PREFIX', '')
            pattern = f"content_list_{self.page}_page_*"
            logger.debug(f"Инвалидация кэша по паттерну: {pattern}")
            cache.delete_pattern(pattern)
            logger.debug(f"Кэш для страницы '{self.page}' инвалидирован.")
        except Exception as e:
            logger.error(f"Ошибка при инвалидации кэша для страницы '{self.page}': {e}", exc_info=True)

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        old_page = None
        if not is_new:
            try:
                old_instance = CommonContentItem.objects.get(pk=self.pk)
                if old_instance.page != self.page:
                    old_page = old_instance.page
            except CommonContentItem.DoesNotExist:
                pass

        if not is_new:
             self.updated_at = timezone.now()

        super().save(*args, **kwargs)

        self._invalidate_cache()
        if old_page and old_page != self.page:
             original_page = self.page
             self.page = old_page
             self._invalidate_cache()
             self.page = original_page

    def delete(self, *args, **kwargs):
        page_to_invalidate = self.page
        super().delete(*args, **kwargs)
        self.page = page_to_invalidate
        self._invalidate_cache()