<?php include('header.php'); ?>

<section class="section-map" id="section-map">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 col-lg-3">
                <div class="div-filtros gris py-3">
                    <div class="row">
                        <div class="col-12">
                            <p>
                                <b>Total de casos confirmados</b><br>
                                <small id="tag-ultima-actualizacion"></small>
                            </p>
                            <h3 class="rojo" id="tag-casos-total"></h3>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <ul class="list-group gris">
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    Activos
                                    <span class="badge badge-activos badge-pill" id="tag-casos-activos"></span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    Recuperados
                                    <span class="badge badge-recuperados badge-pill" id="tag-casos-recuperados"></span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    Fallecidos
                                    <span class="badge badge-fallecidos badge-pill" id="tag-casos-fallecidos"></span>
                                </li>
                            </ul>
                        </div>
                        <div class="col-12 mt-4">
                        <div class="form-group">
                            <label for="select-estado">Filtra por estado</label>
                                <select class="form-control" id="select-estado">
                                    <option value="">Selecciona un estado</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-9 px-0">
                <div id="map" class="map">
                </div>
            </div>
        </div>
    </div>
</section>

<?php include('footer.php'); ?>

